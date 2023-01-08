import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public title = 'calculator-frontend';
  public terms = new Array<string | number>();
  public result: string | undefined= undefined;
  public error: string = "";
  private isInputingFloat = false;
  private readonly operators = ["+", "-", "*", "/"];

  constructor(private http: HttpClient) { }


  public calculate() {
    if (this.terms.length === 0) {
      return;
    }
    this.http.post<{ result: number }>("http://localhost:8081/v1/calculator", {terms: this.terms}).subscribe(res => {
      console.log(res);
      this.terms = [res.result];
    }, ({error}) => {
      console.log(error);
      this.error = error;
      this.terms = [];
    });
  }

  public getTerms(): string {
    if (this.terms.length === 0 && this.error) {
      return "Invalid input";
    }
    return this.terms.reduce<string>((acc, next) => acc + " " + next?.toString?.(), '') + (this.isInputingFloat ? "." : "");
  }

  public addTerm(arg: string | number): void {
    if (this.error) {
      this.error = "";
    }
    if (typeof arg === "string") {
      if (this.operators.includes(arg)) {
        this.isInputingFloat = false;
        this.terms.push(arg);
      } else if (arg === "." && typeof this.terms[this.terms.length - 1] === "number") {
        this.isInputingFloat = true;
      }
    } else if (typeof arg === "number") {
      if (typeof this.terms[this.terms.length - 1] === "number") {
        this.terms[this.terms.length - 1] = parseFloat(this.terms[this.terms.length - 1].toString() + (this.isInputingFloat ? "." : "") + arg.toString());
      } else {
        this.terms.push(arg);
      }
      this.isInputingFloat = false;
    }
  }
}
