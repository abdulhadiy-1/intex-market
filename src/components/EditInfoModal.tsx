import React from "react";
import { MinusInArrowIcon } from '../assets/icons/icon';

interface EditInfoModalProps {
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  initialValue: string;
}

export default function EditInfoModal({ onClose, onSave, title, initialValue }: EditInfoModalProps) {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(value);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        <h2 style={styles.title}>Изменить {title.toLowerCase()}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>{title}</label>
            <div style={styles.inputWrapper}>
              <div style={styles.icon}>
                <MinusInArrowIcon />
              </div>
              <div style={styles.inputContainer}>
                <input 
                  type="text" 
                  value={value}
                  onChange={handleChange}
                  style={styles.input} 
                  placeholder={`Введите ${title.toLowerCase()}`}
                  required
                  autoFocus
                />
              </div>
            </div>
          </div>
          <button type="submit" style={styles.addButton}>Изменить</button>
        </form>
      </div>
    </div>
  );
}

// Matching the exact style of AddCategoryModal
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
    flexDirection: "column" as const,
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
    flexDirection: "column" as const,
    gap: "20px",
    marginBottom: "25px",
    flex: 1,
    justifyContent: "center",
    width: "40%",
    margin: "0 auto",
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
    padding: "24px",
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
    '&:hover': {
      backgroundColor: "#00696d",
    },
  },
};
