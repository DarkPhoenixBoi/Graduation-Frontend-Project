import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import styles from "./ManageTags.module.css";

const ManageTags = () => {
  const [tags, setTags] = useState([]);
  const [tagName, setTagName] = useState("");
  const [editingTag, setEditingTag] = useState(null);

  const baseUrl = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await api.get(`/api/tags`);
      setTags(res.data);
    } catch (err) {
      console.error("Error fetching tags", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTag) {
        await api.put(`/api/tags/${editingTag.id}`, {
          tag_name: tagName,
        });
      } else {
        await api.post(`/api/tags`, {
          tag_name: tagName,
        });
      }
      setTagName("");
      setEditingTag(null);
      fetchTags();
    } catch (err) {
      console.error("Error saving tag", err);
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setTagName(tag.tag_name);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this tag?")) {
      try {
        await api.delete(`/api/tags/${id}`);
        fetchTags();
      } catch (err) {
        console.error("Error deleting tag", err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Tags</h2>
      <form onSubmit={handleSubmit} className={styles.tagForm}>
        <input
          type="text"
          placeholder="Tag name"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          required
        />
        <button type="submit">{editingTag ? "Update" : "Add"}</button>
      </form>
      <table className={styles.tagTable}>
        <thead>
          <tr>
            <th>Tag</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td>{tag.tag_name}</td>
              <td>
                <button onClick={() => handleEdit(tag)}>Edit</button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTags;
