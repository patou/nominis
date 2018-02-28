 const { findNames, toId, getSynonyms, toTab } = require('./convert.js');

test('toId must be lowercase and without parenthesis', () => {
  expect(toId("Megan(e)")).toBe("megan");
});

test('getSynonyms must return all synonyms of a name', () => {
  expect(getSynonyms("Megan(e)")).toContain("Megan", "megan", "Megane", "megane");
});

test('findNames with empty string return empty array', () => {
  expect(findNames("")).toHaveLength(0);
});

test('toTab', () => {
  expect(toTab("0101", "0102")).toContain("0101", "0102");
  expect(toTab(["0101", "0102"], "0103")).toContain("0101", "0102", "0103");
  expect(toTab(["0101", "0102"], "0102")).toContain("0101", "0102");
});

test('findNames with sexe1 classes', () => {
  expect(findNames(`<div class="span5">
<h3>Bonne Fête !</h3>
	<div class="well"><dl>
<dt><a class='sexe1'>Patrice</a>
</dt></dl></div></div>`)).toMatchObject([{id:'patrice', name:'Patrice', kind:"male"}]);
});

test('findNames with sexe0 classes', () => {
  expect(findNames(`<div class="span5">
<h3>Bonne Fête !</h3>
	<div class="well"><dl>
<dt><a class='sexe0'>Patricia</a></dt></dl></div></div>`)).toMatchObject([{id:'patricia', name:'Patricia', kind:"female"}]);
});

test('findNames with sexe1 and sexe0 classes', () => {
  expect(findNames(`<div class="span5">
<h3>Bonne Fête !</h3>
	<div class="well"><dl>
<dt><a class='sexe1'>Patrice</a><dt><dd><a class='sexe0'>Patricia</a>
</dd></dl></div></div>`)).toEqual(expect.arrayContaining([expect.objectContaining({id:'patrice', kind:"male"}),expect.objectContaining({id:'patricia', kind:"female"})]));
});

test('findNames with complete html', () => {
    let html = `<div class="row-fluid">
          	<div class="span5">
<h3>Bonne Fête !</h3>
	<div class="well"><dl>
<dt><a class="sexe2" href="/contenus/prenom/1398/Dominique.html">Dominique</a></dt><dd><a class="sexe1" href="/contenus/prenom/1399/Domineuc.html">Domineuc</a>, <a class="sexe1" href="/contenus/prenom/4908/Dominic.html">Dominic</a>, <a class="sexe1" href="/contenus/prenom/1400/Doumenique.html">Douménique</a></dd><dt><a class="sexe1" href="/contenus/prenom/5865/Eole.html">Eole</a></dt><dd><a class="sexe0" href="/contenus/prenom/6438/Eolia.html">Eolia</a>, <a class="sexe0" href="/contenus/prenom/6439/Eoline.html">Eoline</a></dd><dt><a class="sexe2" href="/contenus/prenom/3348/Cyriaque.html">Cyriaque</a></dt><dt><a class="sexe1" href="/contenus/prenom/5340/Cyrus.html">Cyrus</a></dt><dt><a class="sexe0" href="/contenus/prenom/1039/Julienne.html">Julienne</a></dt><dd><a class="sexe0" href="/contenus/prenom/6252/Giuliana.html">Giuliana</a>, <a class="sexe0" href="/contenus/prenom/6541/Jolien.html">Jolien</a>, <a class="sexe0" href="/contenus/prenom/5270/Juliana.html">Juliana</a>, <a class="sexe0" href="/contenus/prenom/1040/Julianne.html">Julianne</a></dd><dt><a class="sexe0" href="/contenus/prenom/6542/Kyra.html">Kyra</a></dt><dt><a class="sexe1" href="/contenus/prenom/4653/Memmie.html">Memmie</a></dt>	</dl>
		</div>
			<div class="hidden-phone">
<h3>Autres Fêtes du Jour</h3>
<div class="well"><dl><dt><a href="/contenus/saint/7809/Saint-Altmann.html">Saint Altmann</a></dt><dd>évêque de Passau&nbsp;(✝&nbsp;1091)</dd><dt><a href="/contenus/saint/7813/Saint-Anastase.html">Saint Anastase</a></dt><dd>(✝&nbsp;1794)</dd><dt><a href="/contenus/saint/12107/Sainte-Bonifacia-Rodriguez-Castro.html">Sainte Bonifacia Rodríguez Castro</a></dt><dd>fondatrice de la Congrégation des Servantes de Saint-Joseph en Espagne&nbsp;(✝&nbsp;1905)</dd><dt><a href="/contenus/saint/11058/Saints-Cyriaque-et-ses-compagnons.html">Saints Cyriaque et ses compagnons</a></dt><dd>Martyrs à Rome&nbsp;(✝ v. 304)</dd><dt><a href="/contenus/saint/7823/Saint-%C9milien.html">Saint Émilien</a></dt><dd>Évêque de Cyzique&nbsp;(✝&nbsp;820)</dd><dt><a href="/contenus/saint/7883/Saint-Eusebe-de-Milan.html">Saint Eusèbe de Milan</a></dt><dd>évêque de Milan&nbsp;(✝ v. 460)</dd><dt><a href="/contenus/saint/11057/Saint-Famien.html">Saint Famien</a></dt><dd>ermite en Toscane&nbsp;(✝ v. 1150)</dd><dt><a href="/contenus/saint/8849/Saint-Hormisdas.html">Saint Hormisdas</a></dt><dd>Martyr (?) à Ahmadan, en Perse&nbsp;(✝ v. 421)</dd><dt><a href="/contenus/saint/1639/Saint-Jean-Felton.html">Saint Jean Felton</a></dt><dd>Martyr en Angleterre&nbsp;(✝&nbsp;1570)</dd><dt><a href="/contenus/saint/12106/Bienheureux-Jean-Fingley-et-Robert-Bickerdike.html">Bienheureux Jean Fingley et Robert Bickerdike</a></dt><dd>martyrs à York en Angleterre&nbsp;(✝&nbsp;1586)</dd><dt><a href="/contenus/saint/1640/Bienheureuse-Jeanne-d-Aza.html">Bienheureuse Jeanne d'Aza</a></dt><dd>Mère de Saint Dominique&nbsp;(✝ v. 1203)</dd><dt><a href="/contenus/saint/13163/Venerable-Juan-Saez-Hurtado.html">Vénérable Juan Sáez Hurtado</a></dt><dd>prêtre diocésain espagnol&nbsp;(✝&nbsp;1982)</dd><dt><a href="/contenus/saint/7837/Saint-Liebaut.html">Saint Liébaut</a></dt><dd>Fondateur et premier abbé de Fleury-sur-Loire&nbsp;(✝&nbsp;650)</dd><dt><a href="/contenus/saint/12109/Bienheureux-Marie--Pascaline--Nazaire--Antonie--Antoine.html">Bienheureux Marie, Pascaline, Nazaire, Antonie, Antoine</a></dt><dd>martyrs de la guerre civile espagnole&nbsp;(✝&nbsp;1936)</dd><dt><a href="/contenus/saint/12108/Bienheureuse-Marie-Marguerite-%28Marie-Anne-Rose-Caiani%29.html">Bienheureuse Marie-Marguerite (Marie-Anne-Rose Caiani)</a></dt><dd>fondatrice de l'Institut des Sœurs franciscaines minimes du Sacré-Cœur&nbsp;(✝&nbsp;1921)</dd><dt><a href="/contenus/saint/7841/Saint-Marin.html">Saint Marin</a></dt><dd>Martyr en Cilicie&nbsp;(✝&nbsp;290)</dd><dt><a href="/contenus/saint/10266/Sainte-Mary-MacKillop.html">Sainte Mary MacKillop</a></dt><dd>cofondatrice des sœurs de Saint Joseph du Sacré Cœur&nbsp;(✝&nbsp;1909)</dd><dt><a href="/contenus/saint/1642/Saint-Mommole.html">Saint Mommole</a></dt><dd>Abbé de Fleury-sur-Loire&nbsp;(✝&nbsp;678)</dd><dt><a href="/contenus/saint/7844/Saint-Myron-de-Crete.html">Saint Myron de Crête</a></dt><dd>(✝&nbsp;350)</dd><dt><a href="/contenus/saint/7848/Saint-Paul-Keye.html">Saint Paul Keye</a></dt><dd>martyr en Chine&nbsp;(✝&nbsp;1900)</dd><dt><a href="/contenus/saint/13128/Venerable-Rafael-Sanchez-Garcia.html">Vénérable Rafael Sánchez García</a></dt><dd>aumônier de l'hôpital Provincial de Badajoz&nbsp;(✝&nbsp;1973)</dd><dt><a href="/contenus/saint/11059/Bienheureux-Rathard.html">Bienheureux Rathard</a></dt><dd>prêtre en Bavière&nbsp;(9ème s.)</dd><dt><a href="/contenus/saint/12105/Saints-Second--Carpophore--Victorin-et-Severien.html">Saints Second, Carpophore, Victorin et Sévérien</a></dt><dd>martyrs à Albano&nbsp;(✝ v. 305)</dd><dt><a href="/contenus/saint/12104/Saint-Sever.html">Saint Séver</a></dt><dd>prêtre à Vienne en Gaule&nbsp;(5ème s.)</dd><dt><a href="/contenus/saint/7852/Sainte-Sigrade.html">Sainte Sigrade</a></dt><dd>mére de saint Léger d'Autun et de saint Gérin&nbsp;(✝&nbsp;680)</dd><dt><a href="/contenus/saint/7856/Saint-Triantaphyllos.html">Saint Triantaphyllos</a></dt><dd>Martyr&nbsp;(✝&nbsp;1680)</dd><dt><a href="/contenus/saint/12110/Bienheureux-Vladimir-Laskowski.html">Bienheureux Vladimir Laskowski</a></dt><dd>prêtre de Poznan et martyr en Allemagne&nbsp;(✝&nbsp;1940)</dd></dl></div>
			</div>
		</div>
		<div class="span7">
<h3>Saints, Saintes et Fêtes du Jour</h3>
	          <div class="well">
		        <h2><a href="/contenus/saint/1619/Saint-Dominique-de-Guzman.html">Saint Dominique de Guzman</a></h2>
			<h3>Fondateur de l'Ordre des Frères prêcheurs&nbsp;(✝&nbsp;1221)</h3>
			<p></p>	          </div>
		</div>
	</div>`;

  expect(findNames(html)).toEqual(expect.arrayContaining([expect.objectContaining({id:'dominique', kind:"mixte"}), expect.objectContaining({id:'julianne', kind:"female"})]));
});
