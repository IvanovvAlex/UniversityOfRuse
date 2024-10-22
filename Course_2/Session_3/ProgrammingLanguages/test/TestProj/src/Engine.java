import Models.Counter.Counter;

public class Engine {
    public static void main(String[] args) {
        Counter headCount, tailCount;

        headCount = new Counter();
        tailCount = new Counter();

        for (int i = 0; i < 100; i++) {
            if (Math.random() < 0.5) {
                headCount.Increment();
            } else {
                tailCount.Increment();
            }
        }

        System.out.println("Heads: " + headCount.getValue());
        System.out.println("Tails: " + tailCount.getValue());

    }
}
