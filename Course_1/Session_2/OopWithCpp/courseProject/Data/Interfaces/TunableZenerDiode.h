#ifndef TUNABLE_ZENER_DIODE_H
#define TUNABLE_ZENER_DIODE_H

#include "ZenerDiode.h"

class TunableZenerDiode : public ZenerDiode
{
public:
    TunableZenerDiode(const string &brand, const string &model, double forwardVoltage, double maxCurrent,
                      double reverseBreakdownVoltage, double temperatureCoefficient,
                      double controlVoltage, double adjustmentRange);
    virtual ~TunableZenerDiode();

    // Copy Constructor and Assignment Operator
    TunableZenerDiode(const TunableZenerDiode &other);
    TunableZenerDiode &operator=(const TunableZenerDiode &other);

    double GetControlVoltage() const;
    double GetAdjustmentRange() const;

    virtual string ToString() const override;

protected:
    double controlVoltage;
    double adjustmentRange;
};

#endif
