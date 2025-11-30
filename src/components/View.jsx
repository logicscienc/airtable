import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormById, createResponse } from "../api";

export default function View() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getFormById(formId);
        console.log("VIEW RESPONSE:", res.data);
        setForm(res.data?.data || null);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load form");
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleChange = (questionKey, value) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingRequired = form?.questions?.some(
      (q) => q.required && !answers[q.questionKey]
    );
    if (missingRequired) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await createResponse({
        formId: form._id,
        answers,
      });
      alert("Response submitted successfully!");
      setAnswers({});
    } catch (err) {
      console.error(err);
      alert("Failed to submit response");
    }
  };

  if (loading) return <p>Loading form...</p>;
  if (error) return <p>{error}</p>;
  if (!form) return <p>Form not found</p>;

  return (
    <div className="max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{form.title || "Untitled Form"}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {form?.questions?.map((q) => (
          <div key={q.questionKey}>
            <label className="block font-semibold mb-2">
              {q.label} {q.required && "*"}
            </label>

            {(q.type === "shortText" || q.type === "singleLineText") && (
              <input
                type="text"
                value={answers[q.questionKey] || ""}
                onChange={(e) => handleChange(q.questionKey, e.target.value)}
                className="border p-2 w-full sm:text-base text-sm rounded"
              />
            )}

            {q.type === "longText" && (
              <textarea
                value={answers[q.questionKey] || ""}
                onChange={(e) => handleChange(q.questionKey, e.target.value)}
                className="border p-2 w-full sm:text-base text-sm rounded"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-[#FA1239] text-white px-6 py-2 rounded w-full sm:w-auto text-center sm:text-base text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
}




