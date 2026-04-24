#include "vertical/plastering.h"
#include "vertical/antidop.h"
#include "vertical/money.h"
#include <math.h>
#include <string.h>

static bool valid_input(const v_plastering_input* in) {
    return in &&
        in->wall_area_m2 > 0.0 &&
        in->average_layer_mm > 0.0 &&
        in->consumption_kg_per_m2_10mm > 0.0 &&
        in->bag_weight_kg > 0.0 &&
        in->labor_rate_m2 >= 0 &&
        in->floor >= 1;
}

v_status v_plastering_calculate(const v_plastering_input* input, v_plastering_result* output) {
    if (!valid_input(input) || !output) return V_STATUS_INVALID_INPUT;
    memset(output, 0, sizeof(*output));

    const double waste_coef = 1.0 + (input->waste_percent / 100.0);
    output->material_kg = input->wall_area_m2 * input->consumption_kg_per_m2_10mm * (input->average_layer_mm / 10.0) * waste_coef;
    output->bags_count = (int32_t)ceil(output->material_kg / input->bag_weight_kg);

    if (input->material_by_contractor) {
        output->material_cost = input->bag_price * output->bags_count;
    }

    output->labor_cost = v_money_mul_double(input->labor_rate_m2, input->wall_area_m2);
    if (input->include_primer) output->primer_cost = v_money_mul_double(input->primer_rate_m2, input->wall_area_m2);
    if (input->include_beacons) output->beacon_cost = v_money_mul_double(input->beacon_rate_m2, input->wall_area_m2);
    if (input->include_mesh) output->mesh_cost = v_money_mul_double(input->mesh_rate_m2, input->wall_area_m2);

    output->logistics_cost = input->delivery_fixed;
    if (!input->has_elevator && input->floor > 1) {
        output->logistics_cost += input->lift_rate_per_bag_floor * output->bags_count * (input->floor - 1);
    }

    output->internal_cost = output->material_cost + output->labor_cost + output->primer_cost + output->beacon_cost + output->mesh_cost + output->logistics_cost;
    output->risk_reserve = v_money_percent(output->internal_cost, input->risk_reserve_percent);
    const v_money subtotal = output->internal_cost + output->risk_reserve;
    output->margin = v_money_percent(subtotal, input->target_margin_percent);
    output->total_client_price = subtotal + output->margin;
    output->protection_score = v_antidop_score_plastering(input);

    return V_STATUS_OK;
}
