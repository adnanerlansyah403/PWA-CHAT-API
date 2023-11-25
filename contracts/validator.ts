declare module '@ioc:Adonis/Core/Validator' {
    interface Rules {
      notSame(): Rule,
      uniquePhoneForUser(userId: number): Rule,
      notMyPhone(): Rule
    }
}
  