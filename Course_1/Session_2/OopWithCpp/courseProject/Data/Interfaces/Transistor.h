
#ifndef TRANSISTOR_H
#define TRANSISTOR_H

#include "DiscreteSemiconductorDevice.h"

#include <string>

using namespace std;

class Transistor : public DiscreteSemiconductorDevice
{
public:
    // Constructor and Destructor
    Transistor(const string &brand, const string &model, double baseEmitterVoltage, double collectorCurrent);
    virtual ~Transistor();

    // Copy Constructor and Assignment Operator
    Transistor(const Transistor &other);
    Transistor &operator=(const Transistor &other);

    // Virtual method for displaying device details
    virtual string ToString() const override;

    // Accessor methods
    double GetBaseEmitterVoltage() const;
    double GetCollectorCurrent() const;

protected:
    double baseEmitterVoltage;
    double collectorCurrent;
};

#endif
