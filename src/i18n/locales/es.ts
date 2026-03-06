const es = {
  common: {
    cancel: "Cancelar",
    delete: "Eliminar",
    save: "Guardar",
    error: "Error",
    monthly: "Mensual",
    yearly: "Anual",
    success: "\u00C9xito",
  },
  auth: {
    signIn: "Iniciar sesi\u00F3n",
    signUp: "Registrarse",
    email: "Correo electr\u00F3nico",
    password: "Contrase\u00F1a",
    confirmPassword: "Confirmar contrase\u00F1a",
    forgotPassword: "\u00BFOlvidaste tu contrase\u00F1a?",
    noAccount: "\u00BFNo tienes cuenta? ",
    hasAccount: "\u00BFYa tienes cuenta? ",
    enterEmailAndPassword: "Introduce tu correo y contrase\u00F1a.",
    fillAllFields: "Por favor, completa todos los campos.",
    meetPasswordRequirements:
      "Por favor, cumple todos los requisitos de contrase\u00F1a.",
    passwordsDoNotMatch: "Las contrase\u00F1as no coinciden.",
    sendResetLink: "Enviar enlace",
    backToLogin: "Volver al inicio de sesi\u00F3n",
    enterEmailForReset:
      "Introduce tu correo para recibir un enlace de restablecimiento.",
    enterEmail: "Introduce tu correo electr\u00F3nico.",
    resetEmailSent:
      "Te hemos enviado un correo con un enlace para restablecer tu contrase\u00F1a. Revisa tu bandeja de entrada.",
    invalidCredentialTitle: "Correo o contrase\u00F1a inv\u00E1lidos",
    invalidCredentialMessage:
      "Verifica tus credenciales e int\u00E9ntalo de nuevo.",
    tryAgain: "Intentar de nuevo",
    resetPassword: "Restablecer",
    emailSentTitle: "Correo enviado",
    emailSentMessage:
      "Revisa tu bandeja de entrada para el enlace de restablecimiento.",
    linkGoogleBanner:
      "Inicia sesi\u00F3n con tu contrase\u00F1a para vincular tu cuenta de Google.",
    googleLinkedSuccess: "\u00A1Cuenta de Google vinculada con \u00E9xito!",
    passwordRuleLength: "Al menos 8 caracteres",
    passwordRuleUppercase: "Una letra may\u00FAscula",
    passwordRuleNumber: "Un n\u00FAmero",
    passwordRuleSpecial: "Un car\u00E1cter especial",
    or: "o",
    continueWithApple: "Continuar con Apple",
    continueWithGoogle: "Continuar con Google",
    existingAccountTitle: "Cuenta existente",
    existingAccountGoogle:
      "Ya existe una cuenta con este correo. Inicia sesi\u00F3n con tu contrase\u00F1a para vincular Google.",
    existingAccountOther:
      "Ya existe una cuenta con este correo. Inicia sesi\u00F3n con tu m\u00E9todo existente para vincular esta cuenta.",
  },
  verify: {
    title: "Verifica tu correo",
    message:
      "Hemos enviado un enlace de verificaci\u00F3n a\n{{email}}\nRevisa tu bandeja de entrada o carpeta de spam y toca el enlace para continuar.",
    checkButton: "He verificado mi correo",
    resendButton: "Reenviar correo de verificaci\u00F3n",
    signOut: "Cerrar sesi\u00F3n",
    emailSentTitle: "Correo enviado",
    emailSentMessage: "Se ha enviado un nuevo correo de verificaci\u00F3n.",
    notVerifiedTitle: "A\u00FAn no verificado",
    notVerifiedMessage:
      "Tu correo a\u00FAn no est\u00E1 verificado. Revisa tu bandeja de entrada o carpeta de spam y toca el enlace de verificaci\u00F3n.",
    checkErrorMessage:
      "No se pudo verificar el estado. Int\u00E9ntalo de nuevo.",
  },
  authErrors: {
    "auth/invalid-email": "La direcci\u00F3n de correo no es v\u00E1lida.",
    "auth/user-disabled": "Esta cuenta ha sido desactivada.",
    "auth/user-not-found":
      "No se encontr\u00F3 ninguna cuenta con este correo.",
    "auth/wrong-password": "Contrase\u00F1a incorrecta.",
    "auth/invalid-credential":
      "Credenciales inv\u00E1lidas. Verifica tu correo y contrase\u00F1a.",
    "auth/email-already-in-use":
      "Ya existe una cuenta con este correo.",
    "auth/weak-password":
      "La contrase\u00F1a es muy d\u00E9bil. Usa al menos 8 caracteres con may\u00FAscula, n\u00FAmero y car\u00E1cter especial.",
    "auth/too-many-requests":
      "Demasiados intentos. Int\u00E9ntalo m\u00E1s tarde.",
    "auth/network-request-failed":
      "Error de red. Verifica tu conexi\u00F3n.",
    "auth/account-exists-with-different-credential":
      "Ya existe una cuenta con este correo. Inicia sesi\u00F3n con tu m\u00E9todo existente para vincular esta cuenta.",
    "auth/requires-recent-login":
      "Por seguridad, cierra sesi\u00F3n e inicia sesi\u00F3n de nuevo antes de eliminar tu cuenta.",
    default: "Ocurri\u00F3 un error. Int\u00E9ntalo de nuevo.",
  },
  home: {
    title: "Inicio",
    yearlyBudget: "Presupuesto anual",
    monthlyBudget: "Presupuesto mensual",
    totalCosts: "Costos totales",
    leftover: "Restante",
    setYearlyBudget: "Establecer presupuesto anual",
    setMonthlyBudget: "Establecer presupuesto mensual",
    pctUsed: "{{pct}}% usado",
    enterBudget: "Ingresa tu presupuesto {{period}} total",
    noCategories: "A\u00FAn no hay categor\u00EDas.",
    addCategory: "Agregar categor\u00EDa",
  },
  wallets: {
    title: "Billeteras",
    noWallets: "A\u00FAn no hay billeteras.",
    addWallet: "Agregar billetera",
  },
  categoryDetail: {
    yearlyPrefix: "Anual:",
    monthlyPrefix: "Mensual:",
    noExpenses: "No hay gastos en esta categor\u00EDa.",
    addExpense: "Agregar gasto",
  },
  walletDetail: {
    yearlyPrefix: "Anual:",
    monthlyPrefix: "Mensual:",
    noExpenses:
      "No hay gastos para esta billetera.\nAgrega gastos desde una categor\u00EDa.",
  },
  addEditCategory: {
    editTitle: "Editar categor\u00EDa",
    newTitle: "Nueva categor\u00EDa",
    nameLabel: "Nombre",
    namePlaceholder: "ej. Familia, Auto, Casa...",
    iconSection: "Icono",
    saveChanges: "Guardar cambios",
    saveCategory: "Guardar categor\u00EDa",
    deleteCategory: "Eliminar categor\u00EDa",
    deleteTitle: "Eliminar categor\u00EDa",
    deleteMessage:
      '\u00BFEliminar "{{name}}"? Todos los gastos en esta categor\u00EDa tambi\u00E9n ser\u00E1n eliminados. Esta acci\u00F3n no se puede deshacer.',
    enterName: "Ingresa un nombre de categor\u00EDa.",
    saveFailed: "Error al guardar la categor\u00EDa.",
  },
  addEditExpense: {
    editTitle: "Editar gasto",
    newTitle: "Nuevo gasto",
    nameLabel: "Nombre",
    namePlaceholder: "ej. Netflix, Seguro...",
    amountLabel: "Monto ({{symbol}})",
    amountPlaceholder: "12,99",
    walletSection: "Billetera",
    noWallets: "No hay billeteras. Toca para crear una.",
    optionsSection: "Opciones",
    essentialLabel: "Gasto esencial",
    essentialHint:
      "Los gastos esenciales son costos fijos inevitables como alquiler, seguro o suscripciones. Se usan para calcular tu fondo de emergencia.",
    notesSection: "Notas",
    saveChanges: "Guardar cambios",
    saveExpense: "Guardar gasto",
    deleteExpense: "Eliminar gasto",
    deleteTitle: "Eliminar gasto",
    deleteMessage: '\u00BFEliminar "{{name}}"?',
    enterName: "Ingresa un nombre de gasto.",
    invalidAmount: "Ingresa un monto v\u00E1lido.",
    walletRequiredTitle: "Billetera requerida",
    walletRequiredMessage:
      "Necesitas al menos una billetera para guardar un gasto. \u00BFCrear una ahora?",
    createWallet: "Crear billetera",
    saveFailed: "Error al guardar el gasto.",
  },
  addEditWallet: {
    editTitle: "Editar billetera",
    newTitle: "Nueva billetera",
    nameLabel: "Nombre",
    namePlaceholder: "ej. Revolut, N26...",
    bankIconSection: "Icono de banco",
    other: "Otro",
    saveChanges: "Guardar cambios",
    saveWallet: "Guardar billetera",
    deleteWallet: "Eliminar billetera",
    deleteTitle: "Eliminar billetera",
    deleteMessage: '\u00BFEliminar "{{name}}"?',
    enterName: "Ingresa un nombre de billetera.",
    saveFailed: "Error al guardar la billetera.",
  },
  emergency: {
    title: "Fondo de emergencia",
    description:
      "Simula cu\u00E1nto dinero necesitas para cubrir tus gastos esenciales si tus ingresos se detienen.",
    noEssential:
      "A\u00FAn no hay gastos esenciales. Marca un gasto como esencial para empezar a calcular tu fondo de emergencia.",
    expenses: "Gastos",
    monthlyCost: "Costo mensual",
    coveragePeriod: "Per\u00EDodo de cobertura",
    yourTarget: "Tu objetivo",
    targetDetail:
      "{{count}} gastos \u00B7 {{monthlyCost}}/mes \u00D7 {{months}} meses",
    topExpenses: "Gastos principales",
    recommendation:
      "La mayor\u00EDa de los asesores financieros recomiendan ahorrar al menos de 3 a 6 meses de gastos esenciales para imprevistos. Ajusta seg\u00FAn la estabilidad de tu empleo y tu comodidad personal.",
    essentialExpenses: "Gastos esenciales",
    months_one: "{{count}} mes",
    months_other: "{{count}} meses",
    years_one: "{{count}} a\u00F1o",
    years_other: "{{count}} a\u00F1os",
  },
  settings: {
    title: "Ajustes",
    account: "Cuenta",
    email: "Correo electr\u00F3nico",
    currency: "Moneda",
    language: "Idioma",
    legal: "Legal",
    privacyPolicy: "Pol\u00EDtica de privacidad",
    termsOfService: "T\u00E9rminos de servicio",
    support: "Soporte",
    signOut: "Cerrar sesi\u00F3n",
    deleteAccount: "Eliminar cuenta",
    deleteAccountTitle: "Eliminar cuenta",
    deleteAccountMessage:
      "Esto eliminar\u00E1 permanentemente tu cuenta y todos tus datos. Esta acci\u00F3n no se puede deshacer.",
    deleteAccountRecentLogin:
      "Por seguridad, cierra sesi\u00F3n e inicia sesi\u00F3n de nuevo antes de eliminar tu cuenta.",
    deleteAccountFailed:
      "Error al eliminar la cuenta. Int\u00E9ntalo de nuevo.",
    version: "Fixo v{{version}}",
  },
  sort: {
    sortBy: "Ordenar por",
    newest: "M\u00E1s recientes",
    highest: "M\u00E1s altos",
    lowest: "M\u00E1s bajos",
  },
  errorBoundary: {
    title: "Algo sali\u00F3 mal",
    message:
      "Ocurri\u00F3 un error inesperado. Por favor, reinicia la aplicaci\u00F3n.",
    restart: "Reiniciar",
  },
  tabs: {
    home: "Inicio",
    wallets: "Billeteras",
    emergency: "Emergencia",
    settings: "Ajustes",
  },
  expenseList: {
    deleteFailed:
      'No se pudo eliminar "{{name}}". Int\u00E9ntalo de nuevo.',
  },
  categoryCard: {
    expense_one: "{{count}} gasto",
    expense_other: "{{count}} gastos",
  },
  expenseCard: {
    essential: "Esencial",
  },
} as const;

export default es;
