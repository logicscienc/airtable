import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormById, getResponses } from "../api";

export default function FormDetails() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getFormById(formId);
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchResponses = async () => {
      try {
        const res = await getResponses(formId);
        setResponses(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchForm();
    fetchResponses();
  }, [formId]);

  if (!form) return <p>Loading form details...</p>;

  return (
    <div className="p-6 bg-white rounded shadow-md border border-[#FA1239]">
      <h2 className="text-2xl font-bold text-[#FA1239] mb-4">{form.title || "Untitled Form"}</h2>

      <h3 className="font-semibold text-[#FA1239] mb-2">Questions:</h3>
      <ul className="mb-4 list-disc list-inside">
        {form.questions?.map((q) => (
          <li key={q.questionKey}>
            {q.label} ({q.type}) {q.required && "*"}
          </li>
        ))}
      </ul>

      <h3 className="font-semibold text-[#FA1239] mb-2">Responses:</h3>
      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <ul className="space-y-2">
          {responses.map((r) => (
            <li key={r._id} className="border border-[#FA1239] p-2 rounded">
              <p>Submission ID: {r._id}</p>
              <p>Created At: {new Date(r.createdAt).toLocaleString()}</p>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(r.answers, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
