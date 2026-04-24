#ifndef VERTICAL_PLASTERING_H
#define VERTICAL_PLASTERING_H

#include "vertical.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    double wall_area_m2;
    double average_layer_mm;
    double consumption_kg_per_m2_10mm;
    double waste_percent;
    double bag_weight_kg;
    v_money bag_price;
    v_money labor_rate_m2;
    v_money primer_rate_m2;
    v_money beacon_rate_m2;
    v_money mesh_rate_m2;
    v_money lift_rate_per_bag_floor;
    v_money delivery_fixed;
    double risk_reserve_percent;
    double target_margin_percent;
    int32_t floor;
    bool has_elevator;
    bool include_primer;
    bool include_beacons;
    bool include_mesh;
    bool include_slopes;
    bool material_by_contractor;
} v_plastering_input;

typedef struct {
    double material_kg;
    int32_t bags_count;
    v_money material_cost;
    v_money labor_cost;
    v_money primer_cost;
    v_money beacon_cost;
    v_money mesh_cost;
    v_money logistics_cost;
    v_money risk_reserve;
    v_money internal_cost;
    v_money margin;
    v_money total_client_price;
    int32_t protection_score;
} v_plastering_result;

v_status v_plastering_calculate(const v_plastering_input* input, v_plastering_result* output);

#ifdef __cplusplus
}
#endif

#endif
