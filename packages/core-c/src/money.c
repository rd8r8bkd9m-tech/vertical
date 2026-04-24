#include "vertical/money.h"
#include <math.h>

v_money v_money_from_rubles(int64_t rubles) {
    return rubles * 100;
}

v_money v_money_from_rubles_kop(int64_t rubles, int64_t kopecks) {
    return rubles * 100 + kopecks;
}

v_money v_money_mul_double(v_money price, double qty) {
    return (v_money)llround((double)price * qty);
}

v_money v_money_percent(v_money value, double percent) {
    return (v_money)llround((double)value * percent / 100.0);
}
