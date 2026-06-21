import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Calendar, Check, ChevronRight, Plus, Tag, UserRound, X } from 'lucide-react';
import { api } from './api';

const emptyCardForm = {
  title: '',
  description: '',
  member_id: '',
  due_date: '',
  tag_ids: [],
};

const colorOptions = ['#2563eb', '#059669', '#dc2626', '#9333ea', '#f59e0b', '#0891b2'];

function App() {
  const [boards, setBoards] = useState([]);
  const [board, setBoard] = useState(null);
  const [members, setMembers] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState({});
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState(emptyCardForm);
  const [memberForm, setMemberForm] = useState({ name: '', email: '', avatar_color: colorOptions[0] });
  const [tagForm, setTagForm] = useState({ name: '', color: colorOptions[1] });

  const listsById = useMemo(() => new Map((board?.lists ?? []).map((list) => [list.id, list])), [board]);

  async function loadApp() {
    setLoading(true);
    setError('');

    try {
      const [boardList, memberList, tagList] = await Promise.all([
        api.getBoards(),
        api.getMembers(),
        api.getTags(),
      ]);

      let selectedBoard = boardList[0];

      if (!selectedBoard) {
        selectedBoard = await api.createBoard({
          name: 'Forge 2 Launch Board',
          description: 'Demo Kanban board for Forge 2 delivery.',
        });
      } else {
        selectedBoard = await api.getBoard(selectedBoard.id);
      }

      setBoards(boardList);
      setBoard(selectedBoard);
      setMembers(memberList);
      setTags(tagList);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApp();
  }, []);

  async function refreshBoard() {
    if (!board) {
      return;
    }

    setBoard(await api.getBoard(board.id));
  }

  async function createCard(listId) {
    const title = drafts[listId]?.trim();

    if (!title) {
      return;
    }

    await api.createCard(listId, { title });
    setDrafts((current) => ({ ...current, [listId]: '' }));
    await refreshBoard();
  }

  function openEditor(card) {
    setEditingCard(card);
    setCardForm({
      title: card.title,
      description: card.description ?? '',
      member_id: card.member_id ?? '',
      due_date: card.due_date ?? '',
      tag_ids: card.tags.map((tagItem) => tagItem.id),
    });
  }

  async function saveCard(event) {
    event.preventDefault();

    await api.updateCard(editingCard.id, {
      ...cardForm,
      member_id: cardForm.member_id || null,
      due_date: cardForm.due_date || null,
      tag_ids: cardForm.tag_ids,
    });

    setEditingCard(null);
    await refreshBoard();
  }

  async function moveCard(card, direction) {
    const currentIndex = board.lists.findIndex((list) => list.id === card.list_id);
    const targetList = board.lists[currentIndex + direction];

    if (!targetList) {
      return;
    }

    await api.moveCard(card.id, { list_id: targetList.id });
    await refreshBoard();
  }

  async function moveCardToList(listId) {
    await api.moveCard(editingCard.id, { list_id: Number(listId) });
    setEditingCard(null);
    await refreshBoard();
  }

  async function createMember(event) {
    event.preventDefault();

    if (!memberForm.name.trim() || !memberForm.email.trim()) {
      return;
    }

    const member = await api.createMember(memberForm);
    setMembers((current) => [...current, member].sort((a, b) => a.name.localeCompare(b.name)));
    setMemberForm({ name: '', email: '', avatar_color: colorOptions[0] });
  }

  async function createTag(event) {
    event.preventDefault();

    if (!tagForm.name.trim()) {
      return;
    }

    const tag = await api.createTag(tagForm);
    setTags((current) => [...current, tag].sort((a, b) => a.name.localeCompare(b.name)));
    setTagForm({ name: '', color: colorOptions[1] });
  }

  function toggleTag(tagId) {
    setCardForm((current) => ({
      ...current,
      tag_ids: current.tag_ids.includes(tagId)
        ? current.tag_ids.filter((id) => id !== tagId)
        : [...current.tag_ids, tagId],
    }));
  }

  if (loading) {
    return <main className="app-shell status-panel">Loading Forge 2 Kanban...</main>;
  }

  if (error) {
    return (
      <main className="app-shell status-panel">
        <AlertCircle size={28} />
        <h1>API connection needed</h1>
        <p>{error}</p>
        <button type="button" onClick={loadApp}>Retry</button>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Forge 2</p>
          <h1>{board?.name}</h1>
          <p>{board?.description}</p>
        </div>
        <div className="board-meta">
          <span>{boards.length || 1} board</span>
          <span>{members.length} members</span>
          <span>{tags.length} labels</span>
        </div>
      </header>

      <ResourcePanel
        memberForm={memberForm}
        setMemberForm={setMemberForm}
        tagForm={tagForm}
        setTagForm={setTagForm}
        colorOptions={colorOptions}
        createMember={createMember}
        createTag={createTag}
      />

      <section className="board" aria-label="Kanban board">
        {board?.lists?.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            draft={drafts[list.id] ?? ''}
            setDraft={(value) => setDrafts((current) => ({ ...current, [list.id]: value }))}
            createCard={() => createCard(list.id)}
            openEditor={openEditor}
            moveCard={moveCard}
          />
        ))}
      </section>

      {editingCard && (
        <CardModal
          card={editingCard}
          form={cardForm}
          setForm={setCardForm}
          tags={tags}
          members={members}
          lists={board.lists}
          currentList={listsById.get(editingCard.list_id)}
          colorOptions={colorOptions}
          toggleTag={toggleTag}
          saveCard={saveCard}
          moveCardToList={moveCardToList}
          close={() => setEditingCard(null)}
        />
      )}
    </main>
  );
}

function ResourcePanel({
  memberForm,
  setMemberForm,
  tagForm,
  setTagForm,
  colorOptions,
  createMember,
  createTag,
}) {
  return (
    <section className="resource-panel" aria-label="Board resources">
      <form onSubmit={createMember}>
        <strong>Member</strong>
        <input
          value={memberForm.name}
          onChange={(event) => setMemberForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Name"
          aria-label="Member name"
        />
        <input
          type="email"
          value={memberForm.email}
          onChange={(event) => setMemberForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email"
          aria-label="Member email"
        />
        <select
          value={memberForm.avatar_color}
          onChange={(event) => setMemberForm((current) => ({ ...current, avatar_color: event.target.value }))}
          aria-label="Member color"
        >
          {colorOptions.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
        <button type="submit" aria-label="Add member"><Plus size={16} /></button>
      </form>

      <form onSubmit={createTag}>
        <strong>Label</strong>
        <input
          value={tagForm.name}
          onChange={(event) => setTagForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Label name"
          aria-label="Label name"
        />
        <select
          value={tagForm.color}
          onChange={(event) => setTagForm((current) => ({ ...current, color: event.target.value }))}
          aria-label="Label color"
        >
          {colorOptions.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
        <button type="submit" aria-label="Add label"><Plus size={16} /></button>
      </form>
    </section>
  );
}

function ListColumn({ list, draft, setDraft, createCard, openEditor, moveCard }) {
  return (
    <article className="list-column">
      <div className="list-header">
        <h2>{list.name}</h2>
        <span>{list.cards.length}</span>
      </div>

      <div className="cards">
        {list.cards.map((card) => (
          <CardPreview
            key={card.id}
            card={card}
            openEditor={openEditor}
            moveCard={moveCard}
          />
        ))}
      </div>

      <form
        className="new-card"
        onSubmit={(event) => {
          event.preventDefault();
          createCard();
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Add card to ${list.name}`}
          aria-label={`Add card to ${list.name}`}
        />
        <button type="submit" aria-label="Create card">
          <Plus size={18} />
        </button>
      </form>
    </article>
  );
}

function CardPreview({ card, openEditor, moveCard }) {
  return (
    <article className={`kanban-card ${card.is_overdue ? 'overdue' : ''}`}>
      <button className="card-main" type="button" onClick={() => openEditor(card)}>
        <div className="tag-row">
          {card.tags.map((tagItem) => (
            <span key={tagItem.id} className="tag-pill" style={{ '--tag-color': tagItem.color }}>
              {tagItem.name}
            </span>
          ))}
        </div>
        <h3>{card.title}</h3>
        {card.description && <p>{card.description}</p>}
        <div className="card-footer">
          {card.member && (
            <span className="avatar" style={{ '--avatar-color': card.member.avatar_color }}>
              {initials(card.member.name)}
            </span>
          )}
          {card.due_date && (
            <span className="due-date">
              <Calendar size={14} />
              {card.due_date}
            </span>
          )}
        </div>
      </button>
      <div className="move-actions">
        <button type="button" onClick={() => moveCard(card, -1)} aria-label="Move card left">
          <ChevronRight className="left" size={16} />
        </button>
        <button type="button" onClick={() => moveCard(card, 1)} aria-label="Move card right">
          <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}

function CardModal({
  card,
  form,
  setForm,
  tags,
  members,
  lists,
  currentList,
  colorOptions,
  toggleTag,
  saveCard,
  moveCardToList,
  close,
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="card-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{currentList?.name}</p>
            <h2 id="card-title">Edit card</h2>
          </div>
          <button type="button" className="icon-button" onClick={close} aria-label="Close editor">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={saveCard} className="editor-form">
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows="5"
            />
          </label>

          <div className="form-grid">
            <label>
              <UserRound size={16} /> Member
              <select
                value={form.member_id}
                onChange={(event) => setForm((current) => ({ ...current, member_id: event.target.value }))}
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </label>

            <label>
              <Calendar size={16} /> Due date
              <input
                type="date"
                value={form.due_date}
                onChange={(event) => setForm((current) => ({ ...current, due_date: event.target.value }))}
              />
            </label>
          </div>

          <fieldset>
            <legend><Tag size={16} /> Labels</legend>
            <div className="tag-picker">
              {tags.map((tagItem) => (
                <button
                  type="button"
                  key={tagItem.id}
                  className={form.tag_ids.includes(tagItem.id) ? 'selected' : ''}
                  style={{ '--tag-color': tagItem.color }}
                  onClick={() => toggleTag(tagItem.id)}
                >
                  {form.tag_ids.includes(tagItem.id) && <Check size={14} />}
                  {tagItem.name}
                </button>
              ))}
            </div>
            <div className="swatches" aria-label="Available label colors">
              {colorOptions.map((color) => <span key={color} style={{ '--swatch': color }} />)}
            </div>
          </fieldset>

          <label>
            Move to list
            <select defaultValue={card.list_id} onChange={(event) => moveCardToList(event.target.value)}>
              {lists.map((list) => (
                <option key={list.id} value={list.id}>{list.name}</option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" onClick={close}>Cancel</button>
            <button type="submit">Save card</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default App;
