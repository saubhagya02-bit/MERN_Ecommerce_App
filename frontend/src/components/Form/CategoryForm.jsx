const CategoryForm = ({
  handleSubmit,
  value,
  setValue,
  submitLabel = "Submit",
}) => (
  <form onSubmit={handleSubmit} className="flex gap-2">
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter category name"
      className="input-field"
      required
    />
    <button type="submit" className="btn-primary whitespace-nowrap">
      {submitLabel}
    </button>
  </form>
);

export default CategoryForm;
