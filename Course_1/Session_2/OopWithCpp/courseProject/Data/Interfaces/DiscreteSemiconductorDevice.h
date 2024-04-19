#ifndef DISCRETESEMICONDUCTORDEVICE_H
#define DISCRETESEMICONDUCTORDEVICE_H

#include <string>

using namespace std;

class DiscreteSemiconductorDevice
{
public:
    // Constructor and Destructor
    DiscreteSemiconductorDevice(const string &brand, const string &model);
    virtual ~DiscreteSemiconductorDevice();

    // Copy Constructor and Assignment Operator
    DiscreteSemiconductorDevice(const DiscreteSemiconductorDevice &other);
    DiscreteSemiconductorDevice &operator=(const DiscreteSemiconductorDevice &other);

    // Accessor methods
    string GetBrand() const;
    string GetModel() const;

    // Virtual method for displaying device details
    virtual string ToString() const;

protected:
    string brand;
    string model;
};

#endif
