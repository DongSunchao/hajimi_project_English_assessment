#include <emscripten.h>
#include <cmath>
#include <cstring>
#include <vector>

constexpr int SAMPLE_RATE = 16000; //please keep this in sync with frontend/src/config.json
constexpr float NOISE_GATE_THRESHOLD = 0.015f; // Noise gate threshold (needs microphone calibration)
constexpr float SILENCE_THRESHOLD = 0.02f;     // RMS threshold for determining silence
constexpr int FRAME_SIZE = 160;                // 10ms per frame (16000 * 0.01)
constexpr int HOLD_FRAMES = 30;                // Buffer period: 300ms, prevent final consonants being cut off

extern "C" {

    float calculate_rms(const float* buffer, int start, int length) {
        float sum_squares = 0.0f;
        for (int i = 0; i < length; ++i) {
            sum_squares += buffer[start + i] * buffer[start + i];
        }
        return std::sqrt(sum_squares / length);
    }

    EMSCRIPTEN_KEEPALIVE
    int process_audio_edge(float* buffer, int total_length) {
        if (total_length <= FRAME_SIZE) return total_length;

        float gain = 1.0f;
        const float attack_coeff = 0.1f;  // open instantly when sound is detected
        const float release_coeff = 0.002f; // close gradually when sound is lost

        for (int i = 0; i < total_length; i += FRAME_SIZE) {
            int current_frame_size = (i + FRAME_SIZE > total_length) ? (total_length - i) : FRAME_SIZE;
            float rms = calculate_rms(buffer, i, current_frame_size);

            if (rms < NOISE_GATE_THRESHOLD) {
                gain -= release_coeff; // close slowly when below noise gate threshold
                if (gain < 0.0f) gain = 0.0f;
            } else {
                gain += attack_coeff;  // open instantly when sound is detected
                if (gain > 1.0f) gain = 1.0f;
            }

            // apply gain to the current frame
            for (int j = 0; j < current_frame_size; ++j) {
                buffer[i + j] *= gain;
            }
        }

        // ==========================================
        // 2. find start and end indices based on silence detection
        // ==========================================
        int start_index = 0;
        int end_index = total_length;

        // find start index (from head to tail)
        int silence_counter = 0;
        for (int i = 0; i < total_length; i += FRAME_SIZE) {
            int current_frame_size = (i + FRAME_SIZE > total_length) ? (total_length - i) : FRAME_SIZE;
            float rms = calculate_rms(buffer, i, current_frame_size);

            if (rms > SILENCE_THRESHOLD) {
                // find the last silent frame before this strong frame, set start index there
                start_index = std::max(0, i - (FRAME_SIZE * 10)); // back 100ms
                break;
            }
        }

        // find end index (from tail to head)
        silence_counter = 0;
        for (int i = total_length - FRAME_SIZE; i >= 0; i -= FRAME_SIZE) {
            float rms = calculate_rms(buffer, i, FRAME_SIZE);

            if (rms < SILENCE_THRESHOLD) {
                silence_counter++;
            } else {
                // met strong frame, reset silence counter
                silence_counter = 0;
            }

            // only cut when we have seen enough consecutive silent frames, to avoid cutting off trailing consonants
            if (silence_counter > HOLD_FRAMES) {
                // account for the hold frames to avoid cutting off trailing consonants
                end_index = std::min(total_length, i + (FRAME_SIZE * HOLD_FRAMES));
                break;
            }
        }

        // sanity check
        if (start_index >= end_index) {
            return 0; // invalid case, return empty
        }

        // ==========================================
        // 3. move the valid audio segment to the front of the buffer and return the new length
        // ==========================================
        int new_length = end_index - start_index;
        if (start_index > 0) {
            std::memmove(buffer, buffer + start_index, new_length * sizeof(float));
        }

        return new_length;
    }
}