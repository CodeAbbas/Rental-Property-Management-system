listings: any[] = [];

constructor(private api: ApiService) {}

ngOnInit() {
  this.api.getListings().subscribe((res: any) => {
    this.listings = res;
  });
}