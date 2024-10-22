public class Book {
    private int inventoryNumber;
    private String author;
    private String title;
    private int year;
    private String publisher;

    public Book(int inventoryNumber, String author, String title, int year, String publisher) {
        this.inventoryNumber = inventoryNumber;
        this.author = author;
        this.title = title;
        this.year = year;
        this.publisher = publisher;
    }

    public int getInventoryNumber() {
        return inventoryNumber;
    }

    public String toString() {
        return "Автор: " + author + ", Заглавие: " + title + ", Година: " + year + ", Издателство: " + publisher;
    }
}
