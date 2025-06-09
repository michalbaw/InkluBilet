export const getCityName = (idx: number) => {
    switch (idx) {
      case 1:
        return 'Kraków';
      case 2:
        return 'Warszawa';
      case 3:
        return 'Trójmiasto';
      default:
        return 'Wszystkie miasta';
    }
}

export const getAccessibilityName = (idx: number) => {
    switch (idx) {
      case 1:
        return 'Tłumacz migowego';
      case 2:
        return 'Napisy';
      default:
        return 'Wszystkie wydarzenia';
    }
}