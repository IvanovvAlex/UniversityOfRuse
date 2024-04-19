#include "../Interfaces/DiscreteSemiconductorDevice.h"

#include <iostream>
#include <cxxabi.h> // Include the header for demangling
#include <cstdlib>

// Constructor
DiscreteSemiconductorDevice::DiscreteSemiconductorDevice(const string &brand, const string &model)
    : brand(brand), model(model) {}

// Destructor
DiscreteSemiconductorDevice::~DiscreteSemiconductorDevice() {}

// Copy Constructor
DiscreteSemiconductorDevice::DiscreteSemiconductorDevice(const DiscreteSemiconductorDevice &other)
    : brand(other.brand), model(other.model) {}

// Assignment Operator
DiscreteSemiconductorDevice &DiscreteSemiconductorDevice::operator=(const DiscreteSemiconductorDevice &other)
{
    if (this != &other)
    {
        brand = other.brand;
        model = other.model;
    }
    return *this;
}

// Accessor methods
string DiscreteSemiconductorDevice::GetBrand() const
{
    return brand;
}

string DiscreteSemiconductorDevice::GetModel() const
{
    return model;
}

// Virtual method for displaying device details
string DiscreteSemiconductorDevice::ToString() const
{
    int status;
    char *demangled_name = abi::__cxa_demangle(typeid(*this).name(), NULL, NULL, &status);

    string result;
    result += "\n------------------------------------------------------";
    result += "\n\nDevice Details:";
    result += "\n\tClass: ";
    if (status == 0 && demangled_name != nullptr)
    {
        result += demangled_name;  // Use the demangled name if demangling was successful
        std::free(demangled_name); // Free the memory allocated by __cxa_demangle
    }
    else
    {
        result += typeid(*this).name(); // Fallback to mangled name if demangling fails
    }
    result += "\n\tBrand: " + brand;
    result += "\n\tModel: " + model;
    return result;
}
