public class EBook extends Book {
    private String format;
    private double fileSize;

    public EBook(int inventoryNumber, String author, String title, int year, String publisher, String format, double fileSize) {
        super(inventoryNumber, author, title, year, publisher);
        this.format = format;
        this.fileSize = fileSize;
    }

    @Override
    public String toString() {
        return super.toString() + ", Формат: " + format + ", Размер на файл: " + fileSize + "MB";
    }
}
