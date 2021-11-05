/* global device */
/* global element */
/* global by */

export function isAndroid(): boolean {
  return device.getPlatform() === 'android';
}
export function buttonText(text) {
  return isAndroid() ? text.toUpperCase() : text;
}

export function booleanValue(value) {
  return isAndroid() ? (value ? 'true' : 'false') : value;
}

export async function tapButton(text: string): Promise<string> {
  let renderedText = buttonText(text);
  await element(by.text(renderedText)).tap();
  return renderedText;
}
