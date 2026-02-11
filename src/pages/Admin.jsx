import { useEffect, useState } from 'react';
import {
  getAdminSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getCollaborators,
  updateCollaboratorSubjects,
} from '../api/admin';
import styles from './Admin.module.css';

export default function Admin() {
  const [subjects, setSubjects] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [adding, setAdding] = useState(false);
  const [savingCollab, setSavingCollab] = useState(null);

  function load() {
    setLoading(true);
    setError('');
    Promise.all([getAdminSubjects(), getCollaborators()])
      .then(([subjRes, collabRes]) => {
        setSubjects(subjRes.subjects || []);
        setCollaborators(collabRes.collaborators || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleAddSubject(e) {
    e.preventDefault();
    if (!newSubjectName.trim() || adding) return;
    setAdding(true);
    setError('');
    try {
      const created = await createSubject(newSubjectName.trim(), subjects.length);
      setSubjects((prev) => [...prev, created]);
      setNewSubjectName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleToggleSubjectActive(subject) {
    setError('');
    try {
      const updated = await updateSubject(subject.id, { active: !subject.active });
      setSubjects((prev) => prev.map((s) => (s.id === subject.id ? updated : s)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteSubject(id) {
    if (!window.confirm('Remover este assunto?')) return;
    setError('');
    try {
      await deleteSubject(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCollaboratorSubjects(userId, subjectIds) {
    setSavingCollab(userId);
    setError('');
    try {
      const updated = await updateCollaboratorSubjects(userId, subjectIds);
      setCollaborators((prev) => prev.map((c) => (c.id === userId ? { ...c, subjectIds: updated.subjectIds } : c)));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingCollab(null);
    }
  }

  function handleCollabSubjectToggle(collab, subjectId) {
    const next = collab.subjectIds.includes(subjectId)
      ? collab.subjectIds.filter((id) => id !== subjectId)
      : [...collab.subjectIds, subjectId];
    handleCollaboratorSubjects(collab.id, next);
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.pageInner}>
          <p className={styles.loading}>Carregando…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <h1 className={styles.title}>Administração</h1>
        <p className={styles.subtitle}>Assuntos do funil e permissões dos colaboradores.</p>

        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Assuntos</h2>
          <p className={styles.hint}>Assuntos exibidos no widget quando o visitante inicia um atendimento.</p>
          <form onSubmit={handleAddSubject} className={styles.form}>
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Nome do assunto (ex.: Financeiro)"
              className={styles.input}
              disabled={adding}
            />
            <button type="submit" className={styles.btnPrimary} disabled={adding || !newSubjectName.trim()}>
              {adding ? 'Adicionando…' : 'Adicionar'}
            </button>
          </form>
          <ul className={styles.subjectList}>
            {subjects.map((s) => (
              <li key={s.id} className={styles.subjectItem}>
                <span className={s.active ? styles.subjectName : styles.subjectNameInactive}>{s.name}</span>
                <span className={styles.subjectMeta}>Ordem: {s.position}</span>
                <div className={styles.subjectActions}>
                  <button
                    type="button"
                    onClick={() => handleToggleSubjectActive(s)}
                    className={styles.btnSmall}
                  >
                    {s.active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button type="button" onClick={() => handleDeleteSubject(s.id)} className={styles.btnDanger}>
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {subjects.length === 0 && <p className={styles.empty}>Nenhum assunto cadastrado.</p>}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Colaboradores e assuntos</h2>
          <p className={styles.hint}>Selecione quais assuntos cada colaborador pode atender. A fila mostrará apenas tickets do assunto escolhido pelo visitante para quem tiver esse assunto.</p>
          <ul className={styles.collabList}>
            {collaborators.map((c) => (
              <li key={c.id} className={styles.collabItem}>
                <div className={styles.collabHeader}>
                  <strong>{c.name}</strong>
                  <span className={styles.collabEmail}>{c.email}</span>
                  {savingCollab === c.id && <span className={styles.saving}>Salvando…</span>}
                </div>
                <div className={styles.collabSubjects}>
                  {subjects.filter((s) => s.active).map((s) => (
                    <label key={s.id} className={styles.checkLabel}>
                      <input
                        type="checkbox"
                        checked={c.subjectIds.includes(s.id)}
                        onChange={() => handleCollabSubjectToggle(c, s.id)}
                        disabled={savingCollab === c.id}
                      />
                      {s.name}
                    </label>
                  ))}
                  {subjects.filter((s) => s.active).length === 0 && (
                    <span className={styles.muted}>Cadastre assuntos acima.</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {collaborators.length === 0 && <p className={styles.empty}>Nenhum colaborador encontrado.</p>}
        </section>
      </div>
    </div>
  );
}
