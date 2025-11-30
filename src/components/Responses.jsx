import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResponses, deleteResponse } from "../api";
import { FiTrash2 } from "react-icons/fi";

export default function Responses() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); 

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await getResponses(formId);
        setResponses(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching responses:", err);
        setError("Failed to load responses");
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteResponse(deleteTarget._id);
      setResponses((prev) =>
        prev.filter((r) => r._id !== deleteTarget._id)
      );
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete response");
    }
  };

  const exportToCSV = () => {
    if (!responses || responses.length === 0) {
      alert("No responses to export!");
      return;
    }

    const headers = ["ID", "Created", ...Object.keys(responses[0].answers || {})];
    const rows = responses.map((r) => [
      r._id,
      new Date(r.createdAt).toLocaleString(),
      ...Object.values(r.answers || {}),
    ]);
    const csvContent =
      [headers, ...rows]
        .map((e) => e.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `responses_${formId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading responses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#FA1239]">Responses</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
        <p className="text-sm text-gray-600">
          Loaded {responses.length} response(s)
        </p>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-80 w-full sm:w-auto text-center"
          onClick={exportToCSV}
        >
          Export CSV
        </button>
      </div>

      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Created</th>
                <th className="border p-2 text-left">Preview</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {responses.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="border p-2 break-all">{r._id}</td>
                  <td className="border p-2">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="border p-2">
                    {Object.entries(r.answers || {})
                      .slice(0, 2)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </td>

                  <td className="border p-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <button
                      className="px-3 py-1 bg-[#FA1239] text-white rounded hover:opacity-80 w-full sm:w-auto text-center"
                      onClick={() => setSelected(r)}
                    >
                      View Full
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800 text-xl"
                      onClick={() => setDeleteTarget(r)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FULL RESPONSE MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg relative overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-[#FA1239]">
              Full Response
            </h2>

            <div className="space-y-3">
              {Object.entries(selected.answers || {}).map(([key, value]) => (
                <div key={key}>
                  <p className="font-semibold">{key}</p>
                  {typeof value === "object" && value?.url ? (
                    <a
                      href={value.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Download Attachment
                    </a>
                  ) : (
                    <p className="text-gray-700 break-words">{String(value)}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              className="absolute top-2 right-2 text-xl text-gray-600"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM POPUP */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-lg p-6 shadow-lg text-center">
            <h3 className="text-lg font-bold text-red-600 mb-4">
              Delete this response?
            </h3>

            <p className="text-gray-700 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded w-full sm:w-auto"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded w-full sm:w-auto"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




