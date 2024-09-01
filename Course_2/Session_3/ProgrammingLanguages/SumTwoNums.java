import java.io.IOException;

public class SumTwoNums {
    public static void main(String[] args) throws IOException {
        System.out.print("Enter first number: ");
        int numA = readIntFromInput();

        System.out.print("Enter second number: ");
        int numB = readIntFromInput();

        System.out.println("The sum is: " + (numA + numB));
    }

    private static int readIntFromInput() throws IOException {
        int result = 0;
        boolean isNegative = false;
        int currentChar = System.in.read();

        while (currentChar != -1 && (currentChar < '0' || currentChar > '9')) {
            if (currentChar == '-') {
                isNegative = true;
            }
            currentChar = System.in.read();
        }

        while (currentChar != -1 && currentChar >= '0' && currentChar <= '9') {
            result = result * 10 + (currentChar - '0');
            currentChar = System.in.read();
        }

        return isNegative ? -result : result;
    }
}
