#ifndef DIODE_H
#define DIODE_H

#include "DiscreteSemiconductorDevice.h"

#include <string>

using namespace std;

class Diode : public DiscreteSemiconductorDevice
{
public:
    // Constructor and Destructor
    Diode(const string &brand, const string &model, double forwardVoltage, double maxCurrent);
    virtual ~Diode();

    // Copy Constructor and Assignment Operator
    Diode(const Diode &other);
    Diode &operator=(const Diode &other);

    // Virtual method for displaying device details
    virtual string ToString() const override;

    // Accessor methods
    double GetForwardVoltage() const;
    double GetMaxCurrent() const;

protected:
    double forwardVoltage;
    double maxCurrent;
};

#endif
