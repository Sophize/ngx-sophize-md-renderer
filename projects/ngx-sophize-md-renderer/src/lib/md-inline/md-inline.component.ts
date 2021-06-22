import { Component, Input } from '@angular/core';

function getRouterLink(url: string) {
  var match = url.match(
    /^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/
  );
  if (
    typeof match[1] === 'string' &&
    match[1].length > 0 &&
    match[1].toLowerCase() !== location.protocol
  ) {
    return null;
  }
  if (
    typeof match[2] === 'string' &&
    match[2].length > 0 &&
    match[2].replace(
      new RegExp(
        ':(' + { 'http:': 80, 'https:': 443 }[location.protocol] + ')?$'
      ),
      ''
    ) !== location.host
  ) {
    return null;
  }
  if (match.length < 4) return null;
  // TODO: Handle special characters in href better ";" "'"
  let link = match.slice(3).join('');
  return link.startsWith('/') ? link : '/' + link;
}

@Component({
  selector: '[md-inline]',
  templateUrl: './md-inline.component.html',
  styleUrls: ['../md-block/md-block.component.scss'],
})
export class MdInlineComponent {
  @Input('md-inline')
  nodes;

  public _T(value: string) {
    return value || '';
  }

  getHref(node) {
    return node.attributes['href'];
  }

  getRouterLink(node) {
    return getRouterLink(this.getHref(node));
  }

  isExternalLink(node) {
    return !this.getRouterLink(node);
  }

  showExternalIcon(node) {
    return (
      this.isExternalLink(node) &&
      !(node.children.length === 1 && node.children[0].type === 'image')
    );
  }
}
