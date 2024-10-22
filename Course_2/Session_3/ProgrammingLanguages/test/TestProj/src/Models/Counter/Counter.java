package Models.Counter;

public class Counter {
    private int br;

    public Counter() {
        this.br = 0;
    }

    public void Increment() {
        this.br++;
    }

    public String getValue() {
        return Integer.toString(this.br);
    }
}
