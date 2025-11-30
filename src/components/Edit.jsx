import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormById, updateForm } from "../api";

export default function Edit() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getFormById(formId);

        const data =
          res.data?.data?.[0] ||
          res.data?.data ||
          res.data ||
          null;

        console.log("Loaded Form:", data);
        setForm(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateQuestion = (index, key, value) => {
    setForm((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], [key]: value };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleSave = async () => {
    try {
      await updateForm(form._id, form);
      alert("Form updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to save form");
    }
  };

  if (loading) return <p>Loading form...</p>;
  if (!form) return <p>Form not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#FA1239]">
        Edit Form
      </h1>

      {/* Form Title */}
      <label className="block font-semibold mb-1">Form Title</label>
      <input
        type="text"
        value={form.title || ""}
        onChange={(e) => updateField("title", e.target.value)}
        className="border p-2 w-full mb-6 sm:text-base text-sm rounded"
      />

      {/* Questions */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-3">Questions</h2>

      <div className="space-y-6">
        {form.questions?.map((q, index) => (
          <div
            key={q.questionKey || index}
            className="border p-4 rounded-lg bg-gray-50"
          >
            {/* Label */}
            <label className="block font-semibold mb-1">Label</label>
            <input
              type="text"
              value={q.label || ""}
              onChange={(e) =>
                updateQuestion(index, "label", e.target.value)
              }
              className="border p-2 w-full sm:text-base text-sm rounded"
            />

            {/* Type */}
            <label className="block font-semibold mt-3 mb-1">Type</label>
            <select
              value={q.type || "shortText"}
              onChange={(e) => updateQuestion(index, "type", e.target.value)}
              className="border p-2 w-full sm:text-base text-sm rounded"
            >
              <option value="shortText">Short Text</option>
              <option value="longText">Long Text</option>
              <option value="singleSelect">Single Select</option>
              <option value="multiSelect">Multi Select</option>
            </select>

            {/* Required */}
            <label className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={q.required || false}
                onChange={(e) =>
                  updateQuestion(index, "required", e.target.checked)
                }
              />
              <span>Required</span>
            </label>

            {/* Options */}
            {(q.type === "singleSelect" || q.type === "multiSelect") && (
              <div className="mt-3">
                <label className="block font-semibold mb-1">
                  Options (comma separated)
                </label>
                <input
                  type="text"
                  value={(q.options || []).join(",")}
                  onChange={(e) =>
                    updateQuestion(
                      index,
                      "options",
                      e.target.value.split(",").map((opt) => opt.trim())
                    )
                  }
                  className="border p-2 w-full sm:text-base text-sm rounded"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-[#FA1239] text-white px-6 py-2 rounded mt-6 block w-full sm:w-auto text-center sm:text-base text-sm"
      >
        Save Changes
      </button>
    </div>
  );
}



