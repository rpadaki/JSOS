/*
 *  "encode.js"
 *	------------
 *	JavaScript port of C++ EncodeByPhrase, using physKeyCrypt algorithm.
 *  Include in program and use physKeyCrypt() function to use.
 *	decrypt() functionality may or may not be added at this time.
 *
 */
 function encrypt(input)
 {
 	var inps = input.split(" ");
	return physKeyCrypt(inps[0], inps[1]); 
 }

 function decrypt(input)
 {
 	var inps = input.split(" ");
	return physKeyDecrypt(inps[0], inps[1]); 
 }


 function physKeyDecrypt(text, code)
 {
	var key = ["`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./", "~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?"];
	var cod = [];
	for (var i = 0; i < code.length; i++)
	{
		cod.push(key[0].indexOf(code[i]) * key[1].indexOf(code[i]) * -1);
	}
	for (var j = 0; j < text.length; j++)
	{
		var letr = [key[0].indexOf(text[j]) * key[1].indexOf(text[j]) * -1, key[0].indexOf(text[j])];
		if (letr[1] != -1)
			letr[1] = 0;
		else
			letr[1] = 1;

		var tex = text.split("");
		tex[j] = key[letr[1]][(key[0].length * 5 + letr[0] - cod[j%cod.length]) % key[0].length];
		text = tex.join("");
	}
	return text;
 }

 function physKeyCrypt(text, code)
 {
	var key = ["`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./", "~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?"];
	var cod = [];
	for (var i = 0; i < code.length; i++)
	{
		cod.push(key[0].indexOf(code[i]) * key[1].indexOf(code[i]) * -1);
	}
	for (var j = 0; j < text.length; j++)
	{
		var letr = [key[0].indexOf(text[j]) * key[1].indexOf(text[j]) * -1, key[0].indexOf(text[j])];
		if (letr[1] != -1)
			letr[1] = 0;
		else
			letr[1] = 1;

		var tex = text.split("");
		tex[j] = key[letr[1]][(letr[0] + cod[j%cod.length]) % key[0].length];
		text = tex.join("");
	}
	return text;
 }
 
 function corrupt(input)
 {
	var d = new Date();
	var newinput = physKeyCrypt(input, d.getTime());
	newinput = physKeyCrypt(newinput, input);
	newinput = physKeyCrypt(physKeyCrypt(input, newinput), physKeyCrypt(input, d.getDay()));
	return newinput;
 }