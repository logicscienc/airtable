import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResponses } from "../api";

export default function Responses() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null); // modal data

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await getResponses(formId);
        setResponses(res.data?.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load responses");
        setLoading(false);
      }
    };
    fetchResponses();
  }, [formId]);

  if (loading) return <p>Loading responses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#FA1239]">Responses</h1>

      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Created</th>
              <th className="border p-2">Preview</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {responses.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="border p-2">{r._id}</td>
                <td className="border p-2">
                  {new Date(r.createdAt).toLocaleString()}
                </td>

                <td className="border p-2">
                  {Object.entries(r.answers || {})
                    .slice(0, 2) // show only 2 fields preview
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                </td>

                <td className="border p-2">
                  <button
                    className="px-3 py-1 bg-[#FA1239] text-white rounded hover:opacity-80"
                    onClick={() => setSelected(r)}
                  >
                    View Full
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------------------------
            FULL RESPONSE MODAL
      ---------------------------- */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-[500px] rounded-lg p-6 shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-[#FA1239]">
              Full Response
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-auto">
              {Object.entries(selected.answers || {}).map(([key, value]) => (
                <div key={key}>
                  <p className="font-semibold">{key}</p>

                  {/* File attachment */}
                  {value instanceof Object && value.url ? (
                    <a
                      href={value.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Download Attachment
                    </a>
                  ) : (
                    <p className="text-gray-700">{String(value)}</p>
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
    </div>
  );
}
