import { useEditStatusStore } from "@/stores/edit-status.store";

export const Header = () => {
  const { elementTree } = useEditStatusStore();
  return (
    <header className="h-[60px] flex items-center px-4 py-1">
      <button
        onClick={() => {
          const htmlString = `<html><body>${elementTree.toHTML()}</body></html>`;
          // Create a Blob from the HTML string
          const blob = new Blob([htmlString], { type: "text/html" });

          // Create a link element
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "output.html"; // The filename for the downloaded file

          // Append the link to the document, trigger the download, and remove the link
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      >
        Save
      </button>
    </header>
  );
};
