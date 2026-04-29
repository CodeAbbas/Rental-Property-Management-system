loginData = { username: '', password: '' };

constructor(private api: ApiService, private auth: AuthService) {}

login() {
  this.api.login(this.loginData).subscribe((res: any) => {
    this.auth.saveToken(res.token);
    alert("Login successful");
  }, err => {
    alert("Login failed");
  });
}