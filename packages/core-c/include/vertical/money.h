#ifndef VERTICAL_MONEY_H
#define VERTICAL_MONEY_H

#include "vertical.h"

#ifdef __cplusplus
extern "C" {
#endif

v_money v_money_from_rubles(int64_t rubles);
v_money v_money_from_rubles_kop(int64_t rubles, int64_t kopecks);
v_money v_money_mul_double(v_money price, double qty);
v_money v_money_percent(v_money value, double percent);

#ifdef __cplusplus
}
#endif

#endif
