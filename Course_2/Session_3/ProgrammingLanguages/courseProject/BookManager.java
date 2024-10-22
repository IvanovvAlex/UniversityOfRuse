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



import java.awt.*;
import java.util.ArrayList;
import javax.swing.*;

public class BookManager extends JFrame {
    private ArrayList<Book> books = new ArrayList<>();
    
    public BookManager() {
        setTitle("Книжна Система");
        setSize(500, 400);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        
        JPanel headerPanel = new JPanel();
        headerPanel.setLayout(new GridLayout(1, 2, 20, 20));
        headerPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JButton addButton = new JButton("Добави книга");
        JButton searchButton = new JButton("Търсене по инв. номер");
        
        styleButton(addButton);
        styleButton(searchButton);
        
        addButton.addActionListener(e -> addBookWindow());
        searchButton.addActionListener(e -> searchBookWindow());

        headerPanel.add(addButton);
        headerPanel.add(searchButton);
        add(headerPanel, BorderLayout.CENTER);
    }

    private void styleButton(JButton button) {
        button.setFont(new Font("Arial", Font.BOLD, 16));
        button.setBackground(new Color(0, 122, 204));
        button.setForeground(Color.WHITE);
        button.setFocusPainted(false);
        button.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(0, 102, 204)),
                BorderFactory.createEmptyBorder(10, 20, 10, 20))
        );
    }

    private void addBookWindow() {
        JFrame addFrame = new JFrame("Добави книга");
        addFrame.setSize(400, 500);
        addFrame.setLocationRelativeTo(this);
        addFrame.setLayout(new GridLayout(9, 2, 10, 10));
        addFrame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        
        JTextField inventoryField = new JTextField();
        JTextField titleField = new JTextField();
        JTextField yearField = new JTextField();
        JTextField publisherField = new JTextField();
        JCheckBox authorCheckbox = new JCheckBox("Автор 1");
        JCheckBox isEBookCheckbox = new JCheckBox("Електронна книга");
        JTextField formatField = new JTextField();
        JTextField fileSizeField = new JTextField();
        
        formatField.setEnabled(false);
        fileSizeField.setEnabled(false);
        
        isEBookCheckbox.addItemListener(e -> {
            boolean isSelected = isEBookCheckbox.isSelected();
            formatField.setEnabled(isSelected);
            fileSizeField.setEnabled(isSelected);
        });

        JButton saveButton = new JButton("Запази");
        styleButton(saveButton);
        
        saveButton.addActionListener(e -> {
            try {
                int inventory = Integer.parseInt(inventoryField.getText());
                String title = titleField.getText();
                int year = Integer.parseInt(yearField.getText());
                String publisher = publisherField.getText();
                String author = authorCheckbox.isSelected() ? "Автор 1" : "Неизвестен";
                
                if (isEBookCheckbox.isSelected()) {
                    String format = formatField.getText();
                    double fileSize = Double.parseDouble(fileSizeField.getText());
                    books.add(new EBook(inventory, author, title, year, publisher, format, fileSize));
                } else {
                    books.add(new Book(inventory, author, title, year, publisher));
                }
                
                JOptionPane.showMessageDialog(this, "Книгата е добавена!", "Успех", JOptionPane.INFORMATION_MESSAGE);
                addFrame.dispose();
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(this, "Моля въведете валидни данни!", "Грешка", JOptionPane.ERROR_MESSAGE);
            }
        });
        
        addFrame.add(new JLabel("Инв. номер:"));
        addFrame.add(inventoryField);
        addFrame.add(new JLabel("Заглавие:"));
        addFrame.add(titleField);
        addFrame.add(new JLabel("Година:"));
        addFrame.add(yearField);
        addFrame.add(new JLabel("Издателство:"));
        addFrame.add(publisherField);
        addFrame.add(authorCheckbox);
        addFrame.add(isEBookCheckbox);
        addFrame.add(new JLabel("Формат:"));
        addFrame.add(formatField);
        addFrame.add(new JLabel("Размер (MB):"));
        addFrame.add(fileSizeField);
        addFrame.add(new JLabel()); // Empty placeholder
        addFrame.add(saveButton);
        
        addFrame.setVisible(true);
    }

    private void searchBookWindow() {
        JFrame searchFrame = new JFrame("Търсене на книга");
        searchFrame.setSize(400, 250);
        searchFrame.setLocationRelativeTo(this);
        searchFrame.setLayout(new BorderLayout(10, 10));
        searchFrame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        
        JPanel searchPanel = new JPanel(new FlowLayout());
        JTextField searchField = new JTextField(15);
        JButton searchButton = new JButton("Търси");
        styleButton(searchButton);
        
        JTextArea resultArea = new JTextArea(5, 30);
        resultArea.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(resultArea);
        
        searchButton.addActionListener(e -> {
            try {
                int inventory = Integer.parseInt(searchField.getText());
                for (Book book : books) {
                    if (book.getInventoryNumber() == inventory) {
                        resultArea.setText(book.toString());
                        return;
                    }
                }
                resultArea.setText("Книга не е намерена.");
            } catch (NumberFormatException ex) {
                resultArea.setText("Моля въведете валидни числа!");
            }
        });
        
        searchPanel.add(new JLabel("Инв. номер:"));
        searchPanel.add(searchField);
        searchPanel.add(searchButton);
        
        searchFrame.add(searchPanel, BorderLayout.NORTH);
        searchFrame.add(scrollPane, BorderLayout.CENTER);
        searchFrame.setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            BookManager app = new BookManager();
            app.setVisible(true);
        });
    }
}
