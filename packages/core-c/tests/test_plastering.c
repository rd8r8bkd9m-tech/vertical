#include "vertical/plastering.h"
#include "vertical/money.h"
#include <assert.h>
#include <stdio.h>

int main(void) {
    v_plastering_input in = {
        .wall_area_m2 = 100.0,
        .average_layer_mm = 15.0,
        .consumption_kg_per_m2_10mm = 8.5,
        .waste_percent = 10.0,
        .bag_weight_kg = 30.0,
        .bag_price = v_money_from_rubles(480),
        .labor_rate_m2 = v_money_from_rubles(550),
        .primer_rate_m2 = v_money_from_rubles(45),
        .beacon_rate_m2 = v_money_from_rubles(90),
        .mesh_rate_m2 = v_money_from_rubles(120),
        .lift_rate_per_bag_floor = v_money_from_rubles(35),
        .delivery_fixed = v_money_from_rubles(6000),
        .risk_reserve_percent = 5.0,
        .target_margin_percent = 15.0,
        .floor = 2,
        .has_elevator = false,
        .include_primer = true,
        .include_beacons = true,
        .include_mesh = false,
        .include_slopes = false,
        .material_by_contractor = true
    };

    v_plastering_result out;
    v_status status = v_plastering_calculate(&in, &out);
    assert(status == V_STATUS_OK);
    assert(out.bags_count == 47);
    assert(out.material_cost == v_money_from_rubles(22560));
    assert(out.labor_cost == v_money_from_rubles(55000));
    assert(out.protection_score >= 80);
    assert(out.total_client_price > out.internal_cost);

    printf("bags=%d total_kop=%lld score=%d\n", out.bags_count, (long long)out.total_client_price, out.protection_score);
    return 0;
}
