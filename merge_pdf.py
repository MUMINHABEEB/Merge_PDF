import os
from tkinter import Tk, Button, Listbox, filedialog, messagebox, Scrollbar, SINGLE, END
from PyPDF2 import PdfMerger

def save_as_dialog(default_name="output.pdf", filetypes=[("PDF files", "*.pdf")]):
    root = Tk()
    root.withdraw()
    file_path = filedialog.asksaveasfilename(
        defaultextension=".pdf",
        initialfile=default_name,
        filetypes=filetypes,
        title="Save As"
    )
    root.destroy()
    return file_path

class PDFMergerApp:
    def __init__(self, master):
        self.master = master
        master.title("PDF Merger")
        master.geometry("500x400")
        master.resizable(False, False)

        self.pdf_files = []

        self.listbox = Listbox(master, selectmode=SINGLE, width=60)
        self.listbox.pack(pady=20)

        scrollbar = Scrollbar(master, orient="vertical")
        scrollbar.config(command=self.listbox.yview)
        scrollbar.pack(side="right", fill="y")
        self.listbox.config(yscrollcommand=scrollbar.set)

        Button(master, text="Add PDFs", command=self.add_pdfs).pack(pady=5)
        Button(master, text="Remove Selected", command=self.remove_selected).pack(pady=5)
        Button(master, text="Move Up", command=self.move_up).pack(pady=5)
        Button(master, text="Move Down", command=self.move_down).pack(pady=5)
        Button(master, text="Merge PDFs", command=self.merge_pdfs).pack(pady=10)

    def add_pdfs(self):
        files = filedialog.askopenfilenames(filetypes=[("PDF Files", "*.pdf")])
        for file in files:
            if file not in self.pdf_files:
                self.pdf_files.append(file)
                self.listbox.insert(END, os.path.basename(file))

    def remove_selected(self):
        selected = self.listbox.curselection()
        if not selected:
            return
        index = selected[0]
        self.pdf_files.pop(index)
        self.listbox.delete(index)

    def move_up(self):
        selected = self.listbox.curselection()
        if not selected or selected[0] == 0:
            return
        index = selected[0]
        self.pdf_files[index - 1], self.pdf_files[index] = self.pdf_files[index], self.pdf_files[index - 1]
        self.update_listbox(index, index - 1)

    def move_down(self):
        selected = self.listbox.curselection()
        if not selected or selected[0] == len(self.pdf_files) - 1:
            return
        index = selected[0]
        self.pdf_files[index + 1], self.pdf_files[index] = self.pdf_files[index], self.pdf_files[index + 1]
        self.update_listbox(index, index + 1)

    def update_listbox(self, from_idx, to_idx):
        file_name = self.listbox.get(from_idx)
        self.listbox.delete(from_idx)
        self.listbox.insert(to_idx, file_name)
        self.listbox.select_set(to_idx)

    def merge_pdfs(self):
        if not self.pdf_files:
            messagebox.showwarning("No PDFs", "Please add PDF files to merge.")
            return

        default_name = os.path.splitext(os.path.basename(self.pdf_files[0]))[0] + "_merged.pdf"
        output_filename = save_as_dialog(default_name)

        if not output_filename:
            return  # User cancelled

        merger = PdfMerger()
        try:
            for pdf in self.pdf_files:
                merger.append(pdf)
            merger.write(output_filename)
            merger.close()
            messagebox.showinfo("Success", f"Merged PDF saved as: {output_filename}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to merge PDFs: {e}")

if __name__ == "__main__":
    root = Tk()
    app = PDFMergerApp(root)
    root.mainloop()
