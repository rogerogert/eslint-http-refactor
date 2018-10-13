
module.exports = {
    create: function(context) {
        var httpMethods = [
            'delete',
            'get',
            'head',
            'jsonp',
            'patch',
            'post',
            'put'
        ];

        function isHttpCall(node) {
            if (node.callee.type === 'MemberExpression') {
                return httpMethods.indexOf(node.callee.property.name) !== -1 ||
                    (node.callee.object.type === 'CallExpression' && isHttpCall(node.callee.object));
            }
            if (node.callee.type === 'Identifier') {
                return node.callee.name === '$http';
            }
        }

        return {
            CallExpression: function(node) {
                if (node.callee.type !== 'MemberExpression') {
                    return;
                }
                if (node.callee.property.name === 'success' && isHttpCall(node)) {
                    context.report({
                        node: node,
                        message: "'$http success is deprecated.",
                        fix: function (fixer) {
                               return fixer.replaceText(node.callee.property, 'then');
                        }
                    })
                }
                if (node.callee.property.name === 'error' && isHttpCall(node)) {
                    context.report({
                        node: node,
                        message: "'$http error is deprecated.",
                        fix: function(fixer){
                            var rangeToReplace = [node.callee.property.range[0] -2, node.callee.property.range[1] + 1];
                            return fixer.replaceTextRange(rangeToReplace, ',');
                        }
                    })
                }
            }
        };
    }
};