/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = { ...initState, countCode: {} };
    this.listeners = []; // Слушатели изменений состояния
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }
  /**
   * Добавлене кода в объект
   */
  addCode() {
    const actualCodes = this.state.list.map((item) => item.code); //массив видимых на странице кодов
    const deletedCodes = (this.state.deletedList || []).map(
      (item) => item.code
    ); // массив удаленных кодов

    const allCodes = [...actualCodes, ...deletedCodes];

    const maxCode = Math.max(...allCodes);

    return maxCode + 1;
  }
  /**
   * Добавление новой записи
   */
  addItem() {
    const newSymb = { code: this.addCode(), title: "Новая запись" };
    this.setState({
      ...this.state,
      list: [...this.state.list, newSymb],
    });
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    const deleteI = this.state.list.find((cod) => cod.code === code);
    if (deleteI) {
      const upateDeleteI = [...(this.state.deletedList || []), deleteI];

      this.setState({
        ...this.state,
        list: this.state.list.filter((item) => item.code !== code),
        deletedList: upateDeleteI,
      });
    }
  }

  /**
   * Выделение записи по коду
   * @param code
   */
  selectItem(code) {
    const newCountCode = { ...this.state.countCode };
    newCountCode[code] = (newCountCode[code] || 0) + 1;
    const updatedList = this.state.list.map((item) => {
      if (item.code === code) {
        item.selected = !item.selected;
      } else {
        item.selected = false;
      }
      return item;
    });

    this.setState({
      ...this.state,
      countCode: newCountCode,
      list: updatedList,
    });
  }
  /**
   *
   *Добавление записи о количестве кликов
   */
  getCountText(code) {
    let count = this.state.countCode[code] || 0;

    if (count % 2 === 0) count = Math.floor(count / 2);
    else count = Math.floor(count / 2) + 1;

    return count > 0 ? `| Выделяли ${count} раз` : "";
  }
}

export default Store;
