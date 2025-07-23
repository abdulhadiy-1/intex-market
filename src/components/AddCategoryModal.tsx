import React from "react";
import { MinusInArrowIcon } from '../assets/icons/icon';
interface AddCategoryModalProps {
  onClose: () => void;
  onAdd: (values: { name: string; nameUzb: string }) => void;
}

export default function AddCategoryModal({ onClose, onAdd }: AddCategoryModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    nameUzb: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        <h2 style={styles.title}>Добавить категории</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Название</label>
            <div style={styles.inputWrapper}>
              <div style={styles.icon}>
                <MinusInArrowIcon />
              </div>
              <div style={styles.inputContainer}>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input} 
                  placeholder="Введите название на русском"
                  required
                />
              </div>
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>На узбекском</label>
            <div style={styles.inputWrapper}>
              <div style={styles.icon}>
                <MinusInArrowIcon />
              </div>
              <div style={styles.inputContainer}>
                <input 
                  type="text" 
                  name="nameUzb"
                  value={formData.nameUzb}
                  onChange={handleChange}
                  style={styles.input} 
                  placeholder="Введите название на узбекском"
                  required
                />
              </div>
            </div>
          </div>
        </form>
        <button type="submit" style={styles.addButton}>Добавить</button>
      </div>
    </div>
  );
}

// Simple inline styles (for demonstration)
const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "var(--clr-bg, #fff)",
    borderRadius: "12px",
    padding: "80px 120px",
    width: "80%",
    height: "50%",
    position: "relative" as const,
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  closeBtn: {
    position: "absolute" as const,
    top: "15px",
    right: "40px",
    background: "none",
    border: "none",
    fontSize: "58px",
    cursor: "pointer",
    color: "#666",
  },
  title: {
    fontFamily: '"Source Sans Pro", sans-serif',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: "40px",
    lineHeight: "100%",
    letterSpacing: "0%",
    textAlign: "center" as const,
    margin: "0 0 40px 0",
    color: "#007D82",
  },
  form: {
    display: "flex",
    flexDirection: "row" as const,
    gap: "20px",
    marginBottom: "25px",
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
    flex: 1,
  },
  label: {
    marginBottom: "8px",
    color: "#666",
    fontSize: "14px",
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: '1px solid #545454',
    overflow: 'hidden',
    backgroundColor: '#fff',
    flex: 1,
    '&:focus-within': {
      borderColor: '#40a9ff',
      boxShadow: '0 0 0 2px rgba(24, 144, 255, 0.2)',
    },
  },
  icon: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  },
  input: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },
  addButton: {
    display: "block",
    margin: "30px auto 0",
    padding: "10px 40px",
    backgroundColor: "#009398",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontSize: "22px",
    cursor: "pointer",
    fontWeight: 500,
    transition: "background-color 0.2s",
    width: "300px",
  },
  addButtonHover: {
    backgroundColor: "#00696d",
  },
};
