#include "vertical/antidop.h"

int32_t v_antidop_score_plastering(const v_plastering_input* input) {
    if (!input) return 0;
    int score = 0;
    int total = 10;

    if (input->wall_area_m2 > 0.0) score++;
    if (input->average_layer_mm > 0.0) score++;
    if (input->consumption_kg_per_m2_10mm > 0.0) score++;
    if (input->bag_weight_kg > 0.0) score++;
    if (input->labor_rate_m2 > 0) score++;
    if (input->floor >= 1) score++;
    if (input->include_primer) score++;
    if (input->include_beacons) score++;
    if (input->delivery_fixed >= 0) score++;
    if (input->risk_reserve_percent >= 0.0) score++;

    return (int32_t)((score * 100) / total);
}
