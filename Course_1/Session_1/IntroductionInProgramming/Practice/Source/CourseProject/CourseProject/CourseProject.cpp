#include <iostream>
#include <string>
#include <fstream>
#include <stdexcept>
#include <cstdio> 

using namespace std;

struct City {
	string name;
	int population;
	int yearOfCreation;
	double altitude;
	double avgYearTemp;
};

int main() {
	try {
		cout << "Enter the number of cities: ";
		int n;
		cin >> n;

		if (n <= 0) {
			cerr << "Invalid number of cities. Please enter a positive integer." << endl;
			return 1;
		}

		City* cities = new City[n];

		for (int i = 0; i < n; i++) {
			try
			{
				cout << "\n-------------------------------------------------------\n\nEnter the name of the city: ";
				cin >> cities[i].name;
				cout << "Enter the population of the city: ";
				cin >> cities[i].population;
				cout << "Enter the year of creation of the city: ";
				cin >> cities[i].yearOfCreation;
				cout << "Enter the altitude of the city: ";
				cin >> cities[i].altitude;
				cout << "Enter the average yearly temperature of the city: ";
				cin >> cities[i].avgYearTemp;
			}
			catch (const exception& e) {
				cerr << "Invalid Data Type!";
			}
		}

		cout << "\n-------------------------------------------------------\n\nEnter the year for filtering: ";
		int yearFilter;
		cin >> yearFilter;

		if (remove("./cities.txt") != 0) {
			cerr << "Error deleting the file." << endl;
		}

		ofstream file;
		file.open("./cities.txt");

		for (int i = 0; i < n; i++) {
			if (cities[i].yearOfCreation < yearFilter) {
				file << "Name: " << cities[i].name << "\nPopulation: " << cities[i].population << "\nYear Of Creation: " << cities[i].yearOfCreation << "\nAltitude: " << cities[i].altitude << "\nAvg Year Temp: " << cities[i].avgYearTemp << "\n-------------------------------------------------------------------------\n";
			}
		}

		delete[] cities;

	}
	catch (const exception& e) {
		cout << "Error: " << e.what() << endl;
		return 1;
	}

	return 0;
}
