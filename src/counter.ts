export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  let test = 'test';
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
