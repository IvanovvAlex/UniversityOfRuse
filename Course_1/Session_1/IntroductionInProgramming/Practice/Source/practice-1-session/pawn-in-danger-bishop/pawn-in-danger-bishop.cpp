#include <iostream>
#include <cmath>
#include <string>
#include <sstream>

using namespace std;

bool isInDanger(int bishopX, int bishopY, int pawnX, int pawnY) {
	return abs(bishopX - pawnX) == abs(bishopY - pawnY);
}

int main() {
	string input;
	int bishopX, bishopY, pawnX, pawnY;

	while (true)
	{
		cout << "Enter the x-coordinate of the bishop or type 'stop' to exit: ";
		cin >> input;
		if (input == "stop") break;
		stringstream(input) >> bishopX;

		cout << "Enter the y-coordinate of the bishop: ";
		cin >> input;
		if (input == "stop") break;
		stringstream(input) >> bishopY;

		cout << "Enter the x-coordinate of the pawn: ";
		cin >> input;
		if (input == "stop") break;
		stringstream(input) >> pawnX;

		cout << "Enter the y-coordinate of the pawn: ";
		cin >> input;
		if (input == "stop") break;
		stringstream(input) >> pawnY;

		if (isInDanger(bishopX, bishopY, pawnX, pawnY)) {
			cout << "The pawn is in danger!" << endl;
		}
		else {
			cout << "The pawn is safe." << endl;
		}
	}

	return 0;
}
