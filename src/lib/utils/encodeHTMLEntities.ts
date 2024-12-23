export default (text: string) => {
    var entities = [
        ["&", "&amp;"],
        ["'", "&apos;"],
        ["'", "&#x27;"],
        ["/", "&#x2F;"],
        ["'", "&#39;"],
        ["/", "&47;"],
        ["<", "&lt;"],
        [">", "&gt;"],
        [" ", "&nbsp;"],
        ['"', "&quot;"],
    ] as const;

    for (var i = 0, max = entities.length; i < max; ++i)
        text = text.replace(new RegExp(entities[i]![0]!), entities[i]![1]!);

    return text;
};
