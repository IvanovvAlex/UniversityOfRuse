#include <iostream>

using namespace std;

void twoDigitNumsDivisibleByThree() {
	cout << "The two-digit numbers divisible by 3 are:" << endl;

	for (int i = 10; i <= 99; ++i) {
		if (i % 3 == 0) {
			cout << i << " ";
		}
	}

	cout << endl;
}

int numDigits(int num) {
	int count = 0;
	while (num != 0) {
		num /= 10;
		++count;
	}
	return count;
}

int sumOfArray(int arr[], int size) {
	int sum = 0;
	for (int i = 0; i < size; ++i) {
		sum += arr[i];
	}
	return sum;
}

int main() {

	//twoDigitNumsDivisibleByThree();

}

