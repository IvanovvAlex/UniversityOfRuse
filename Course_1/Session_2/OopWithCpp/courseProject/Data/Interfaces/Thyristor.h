#ifndef THYRISTOR_H
#define THYRISTOR_H

#include "DiscreteSemiconductorDevice.h"

#include <string>

using namespace std;

class Thyristor : public DiscreteSemiconductorDevice
{
public:
    // Constructor and Destructor
    Thyristor(const string &brand, const string &model, double gateTriggerVoltage, double holdingCurrent);
    virtual ~Thyristor();

    // Copy Constructor and Assignment Operator
    Thyristor(const Thyristor &other);
    Thyristor &operator=(const Thyristor &other);

    // Virtual method for displaying device details
    virtual string ToString() const override;

    // Accessor methods
    double GetGateTriggerVoltage() const;
    double GetHoldingCurrent() const;

protected:
    double gateTriggerVoltage;
    double holdingCurrent;
};

#endif
