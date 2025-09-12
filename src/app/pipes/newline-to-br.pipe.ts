import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'newlineToBr'
})
export class NewlineToBrPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml | '' {
    if (value == null) return '';

    // Convert literal backslash-n sequences ("\n") to actual newlines
    let v = value.replace(/\\n/g, '\n');

    // Turn real newlines into <br>
    v = v.replace(/\r\n|\n|\r/g, '<br>');

    // Convert escaped <br> entities into real <br> (handle variants)
    v = v.replace(/&lt;br\s*\/?&gt;/gi, '<br>');

    // Return as trusted HTML for innerHTML binding
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }
}
