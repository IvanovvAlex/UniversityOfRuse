#ifndef ZENER_DIODE_H
#define ZENER_DIODE_H

#include "Diode.h"

class ZenerDiode : public Diode
{
public:
    ZenerDiode(const string &brand, const string &model, double forwardVoltage, double maxCurrent,
               double reverseBreakdownVoltage, double temperatureCoefficient);
    virtual ~ZenerDiode();

    ZenerDiode(const ZenerDiode &other);
    ZenerDiode &operator=(const ZenerDiode &other);

    double GetReverseBreakdownVoltage() const;
    double GetTemperatureCoefficient() const;

    virtual string ToString() const override;

protected:
    double reverseBreakdownVoltage;
    double temperatureCoefficient;
};

#endif
