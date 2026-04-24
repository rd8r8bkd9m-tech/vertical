# Estimate Engine

## Money

Money is stored in kopecks as signed 64-bit integer.

```text
14500000 = 145 000 ₽ 00 коп.
```

## Rounding

- Bags are rounded up.
- Materials are rounded up to package quantity.
- Client total can be rounded to configured step later.
- Internal calculations must keep precision until final step.

## Determinism

No AI and no floating money calculations decide final totals.
