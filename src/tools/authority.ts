export function getAuthority(data: any, isSelected: boolean, button: any = []): any {
  let buttons: any = button;

  for (const i of data) {
    if (!i.name) i.name = i.menuName;

    if (i?.button?.length > 0) {
      i.button.unshift({ name: '菜单权限', value: `view-${i.name}` });

      for (const btn of i.button) {
        btn.isSelected = isSelected;
      }
      buttons = [...buttons, ...(i?.button?.map((v: any) => v.value) || [])];
    } else i.button = [];

    if (i?.children?.length > 0) buttons = [...buttons, ...getAuthority(i.children, isSelected, buttons)];
  }

  return [...new Set(buttons)];
}

export function arrayObjectToObject(data: Array<any>): any {
  const result: any = {};

  for (const i of data) {
    if (i?.children?.length > 0) {
      i.children = arrayObjectToObject(i.children);
      result[i.name] = i;
    } else if (i?.button?.length > 0) {
      i.button = arrayObjectToObject(i.button);
      result[i.name] = i;
    } else result[i.name] = i;
  }

  return result;
}

export function objectToArrayObject(data: any): Array<any> {
  const result: Array<any> = [];

  for (const key in data) {
    if (Object.keys(data[key]?.children || {})?.length > 0) {
      data[key].children = objectToArrayObject(data[key].children);
      result.push(data[key]);
    } else if (Object.keys(data[key]?.button || {})?.length > 0) {
      data[key].button = objectToArrayObject(data[key].button);
      result.push(data[key]);
    } else result.push(data[key]);
  }

  return result;
}
